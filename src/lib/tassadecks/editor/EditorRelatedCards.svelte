<script>
    import Subtitle from '../../shared/Subtitle.svelte';
    import CardPrintItem from '../CardPrintItem.svelte';
    import Pagination from '../../shared/Pagination.svelte';
    import Modal from '../../shared/Modal.svelte';
    import Button from '../../shared/Button.svelte';
    import { t } from 'svelte-i18n';
    import EditorRelatedCardDetails from './EditorRelatedCardDetails.svelte';
    import axios from 'axios';
    import { showToast } from '../../../services/toastService.js';
    import IconInfo from '../../shared/IconInfo.svelte';

    export let handleCardPrintsDisplay = () => {};
    export let deck;
    export let relatedCards = [];
    export let switchCardPrintBaseUrl;

    let cardDetailsContainerRef;
    let selectedRelatedCard;
    let showRelatedModal = false;
    let paginatedCardPrints = { cards: [] };
    let isSelectedCardSwitchingPrint = true;

    const switchRelatedCardPrintRequest = async (print) => {
        try {
            await axios.post(`/api/auth/reserved/cards/prints/${deck.id}/related/switch`, {
                printId: print.scryfallId,
            });
            showToast(`${print.translation.name} print switch to ${print.set.name}`);
            return true;
        } catch (e) {
            showToast(`Error while switching ${print.translation.name} print`, 'error');
            return false;
        }
    };

    const handleRelatedClicked = async (relatedPrint) => {
        selectedRelatedCard = relatedPrint;
        paginatedCardPrints = await handleCardPrintsDisplay(selectedRelatedCard.related);
        showRelatedModal = true;
    };

    const handleCloseRelatedCardDetails = () => {
        showRelatedModal = false;
        isSelectedCardSwitchingPrint = false;
    };

    const handleSwitchRelatedCardPrint = async (print) => {
        if (await switchRelatedCardPrintRequest(print)) {
            selectedRelatedCard.related.print = print;
            deck = { ...deck };
        }
        isSelectedCardSwitchingPrint = false;
    };

    $: {
        relatedCards = [];
        for (const categoryObject of deck.categories) {
            for (const cardObject of categoryObject.cards) {
                for (const relatedPrint of cardObject.relatedPrints) {
                    const alreadyExists = relatedCards.some(
                        (pushedRelatedCard) => pushedRelatedCard.related.print.oracleId === relatedPrint.print.oracleId
                    );

                    if (!alreadyExists) {
                        relatedCards.push({
                            bases: [cardObject],
                            related: relatedPrint,
                        });
                    } else {
                        const existingEntry = relatedCards.find(
                            (pushedRelatedCard) => pushedRelatedCard.related.print.oracleId === relatedPrint.print.oracleId
                        );

                        if (existingEntry) {
                            existingEntry.bases.push(cardObject);
                        }
                    }
                }
            }
        }
        relatedCards.sort((a, b) => a.related.print.translation.name.localeCompare(b.related.print.translation.name));
    }
</script>

<!-- TODO: replace by carousel after component patch -->
{#if relatedCards.length}
    <div class="flex flex-row gap-3">
        <Subtitle className="my-5 font-bold text-xl">{$t('tassadecks.editor.related-cards.title')}</Subtitle>
        <IconInfo>{$t('tassadecks.editor.related-cards.description')}</IconInfo>
    </div>
    <div class="flex flex-row gap-3 flex-wrap justify-center pb-5">
        {#each relatedCards as relatedCard}
            <div class="flex justify-center">
                <Button on:click={() => handleRelatedClicked(relatedCard)}>
                    <img
                        src={relatedCard.related.print.imageUri.normal}
                        alt={relatedCard.related.print.translation?.name}
                        class="h-auto rounded-lg w-48"
                    />
                </Button>
            </div>
        {/each}
    </div>
{/if}

<!-- Related card modal -->
<Modal bind:showModal={showRelatedModal} on:close={handleCloseRelatedCardDetails} fullWidth={true}>
    <Subtitle slot="header">{selectedRelatedCard?.related?.print?.translation?.name}</Subtitle>
    {#if isSelectedCardSwitchingPrint}
        <div bind:this={cardDetailsContainerRef} class="flex flex-row flex-wrap gap-5 justify-center overflow-y-auto max-h-[75vh]">
            {#each paginatedCardPrints.cards as print}
                <CardPrintItem
                    bind:card={print}
                    bind:selectedCard={selectedRelatedCard}
                    on:choosePrint={(e) => handleSwitchRelatedCardPrint(e.detail)}
                />
            {/each}
        </div>
        <Pagination bind:paginatedObject={paginatedCardPrints} bind:baseUrl={switchCardPrintBaseUrl} containerRef={cardDetailsContainerRef} />
    {:else}
        <EditorRelatedCardDetails bind:selectedRelatedCard bind:switching={isSelectedCardSwitchingPrint} {deck} />
    {/if}
</Modal>
