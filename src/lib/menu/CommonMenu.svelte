<script>
    import MenuItem from './MenuItem.svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore.js';

    export let footer = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
    <MenuItem {footer} iconLeft="home" href="/" on:click>{$t('menu.home')}</MenuItem>
    <MenuItem {footer} iconLeft="camera" href="/tassadraft" on:click>{$t('common.tassadraft')}</MenuItem>
    <MenuItem {footer} iconLeft="book" href="/tassadecks" on:click>{$t('common.tassadecks')}</MenuItem>
    <MenuItem {footer} iconLeft="camera" href="#" on:click>{$t('common.tassacards')}</MenuItem>
    <MenuItem {footer} iconLeft="settings" href="/settings" on:click>{$t('menu.settings')}</MenuItem>
    {#if $profile}
        <MenuItem {footer} iconLeft="user" href="/profile" on:click>{$t('menu.profile')}</MenuItem>
        <MenuItem {footer} iconLeft="userRemove" href="/logout" on:click>{$t('menu.logout')}</MenuItem>
    {:else}
        <MenuItem {footer} iconLeft="user" href="/login" on:click>{$t('menu.login')}</MenuItem>
    {/if}
</ul>
