<script>
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import Form from '../shared/Form.svelte';
    import Select from '../shared/Select.svelte';
    import Textarea from '../shared/Textarea.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Switch from '../shared/Switch.svelte';
    import { showToast } from '../../services/toastService.js';

    let subjects = [];
    let message = '';
    let consent = false;
    let isValid = false;

    onMount(async () => {
        const { data } = await axios.get('/api/auth/contact/subjects');
        subjects = data.map((value) => {
            return { value, label: $t(`contact.subject.${value}`) };
        });
    });

    const handleSuccess = () => {
        message = '';
        consent = false;
        showToast($t('toast.contact.success'));
    };

    const handleError = () => {
        showToast($t('toast.contact.error'), 'error');
    };

    $: isValid = consent && message && message.length >= 32 && message.length <= 1024;
</script>

<Title title={$t('contact.title')} hasBackground={true} />

<Form action="/api/auth/contact" method="POST" on:success={handleSuccess} on:error={handleError} bind:isValid>
    <Select name="subject" label={$t('contact.subject.label')} options={subjects} />
    <Textarea
        name="message"
        bind:value={message}
        label={$t('contact.message.label')}
        placeholder={$t('contact.message.placeholder')}
        required={true}
        min={32}
        max={1024}
    />
    <Switch name="consent" size="6" label={$t('contact.consent')} bind:value={consent} required={true} />
</Form>
