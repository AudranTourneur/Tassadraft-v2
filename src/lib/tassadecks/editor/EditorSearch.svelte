<script>
    import Icon from '../../shared/Icon.svelte';
    import Button from '../../shared/Button.svelte';
    import Modal from '../../shared/Modal.svelte';
    import CardSearchItem from '../CardSearchItem.svelte';
    import Pagination from '../../shared/Pagination.svelte';
    import Search from '../../shared/Search.svelte';
    import Subtitle from '../../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import axios from 'axios';
    import { showToast } from '../../../services/toastService.js';

    export let deck;
    export let addCardRequest = async () => {};
    export let removeCardRequest = async () => {};

    let paginatedSearchedCards = { cards: [] };
    let cardSearchBaseUrl = '';
    let showModal = false;
    let scrollContainer;

    const handleSearch = async (query) => {
        try {
            cardSearchBaseUrl = `/api/auth/reserved/cards/search?query=${query}&language=${localStorage.getItem('language')}`;
            const { data: paginated } = await axios.get(cardSearchBaseUrl);
            paginatedSearchedCards = paginated;
        } catch (e) {
            showToast($t('toast.editor.search.error'), 'error');
        }
    };
</script>

<Button on:click={() => (showModal = true)}>
    <div class="flex flex-row gap-1">
        <Icon name="search" />
        <p>{$t('common.search')}</p>
    </div>
</Button>

<Modal bind:showModal fullWidth={true}>
    <Subtitle slot="header">{$t('tassadecks.editor.search.title')}</Subtitle>

    <Search
        bind:selectedObserver={showModal}
        selected={true}
        bind:results={paginatedSearchedCards.cards}
        placeholder={$t('tassadecks.editor.search.placeholder')}
        label={$t('tassadecks.editor.search.label')}
        name="searchCard"
        {handleSearch}
    />

    <!-- TODO: fix this issue #58 -->
    <div bind:this={scrollContainer} class="flex flex-row flex-wrap gap-5 justify-center">
        {#each paginatedSearchedCards.cards as card}
            <CardSearchItem bind:deck {card} {addCardRequest} {removeCardRequest} />
        {/each}
    </div>
    <Pagination bind:paginatedObject={paginatedSearchedCards} bind:baseUrl={cardSearchBaseUrl} bind:containerRef={scrollContainer} />
</Modal>
