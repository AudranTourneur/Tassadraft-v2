<script>
    import axios from 'axios';
    import Button from './Button.svelte';
    import Loader from './Loader.svelte';
    import Icon from './Icon.svelte';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import FormBackground from './background/FormBackground.svelte';

    const dispatch = createEventDispatcher();

    export let method = 'GET';
    export let action = '';
    export let isValid = false;
    export let submittable = true;
    export let showBackground = true;

    let loading = false;
    let isSendButtonDisabled = false;

    const handleSubmit = async (event) => {
        event.preventDefault();
        loading = true;
        const form = event.target;
        const formData = new FormData(form);

        const formDataObj = {
            language: localStorage.getItem('language'),
        };
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        try {
            const response = await axios({
                method,
                url: `${axios.defaults.baseURL}${action}`,
                data: method === 'GET' ? null : formData,
                params: method === 'GET' ? formDataObj : null,
                headers: method !== 'GET' ? { 'Content-Type': 'multipart/form-data' } : {},
            });
            loading = false;
            dispatch('success', response.data);
        } catch (error) {
            loading = false;
            dispatch('error', error.message);
        }
    };

    $: isSendButtonDisabled = !isValid;
</script>

{#if showBackground}
    <FormBackground />
{/if}

<form
    {action}
    on:submit={handleSubmit}
    {method}
    class="relative z-10 bg-gray-200 dark:bg-gray-700 rounded-2xl p-2 md:p-6 shadow-lg m-auto {showBackground ? 'mt-24' : ''}"
    style="max-width: 500px;"
>
    <slot />
    {#if submittable}
        <div class="w-full flex justify-end mt-4">
            <Button
                type="submit"
                bind:disabled={isSendButtonDisabled}
                additionalStyle="bg-green-700 ${isSendButtonDisabled ? 'cursor-not-allowed' : 'hover:bg-green-800'} rounded-lg p-2"
            >
                <div class="flex flex-row items-center gap-3">
                    <p class="text-white">{$t('common.submit')}</p>
                    <Icon name="send" />
                </div>
            </Button>
        </div>
    {/if}
    <Loader bind:loading />
</form>
