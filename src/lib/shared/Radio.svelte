<script>
    export let options;
    export let legend;
    export let selected = options.find((option) => option.selected)?.value || options[0].value;
    export let fontSize = 16;
    export let flexDirection = 'column';
    export let handleChange = () => {};

    const uniqueID = Math.floor(Math.random() * 100);

    const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

<div
    role="radiogroup"
    class={`mt-5 flex ${flexDirection === 'column' ? 'flex-col' : 'flex-row'}`}
    aria-labelledby={`label-${uniqueID}`}
    style="font-size: {fontSize}px"
    id={`group-${uniqueID}`}
>
    <div class="legend font-bold mb-2" id={`label-${uniqueID}`}>
        <p>{legend}</p>
    </div>
    {#each options as { value, label }}
        <div>
            <input class="sr-only" type="radio" id={slugify(label)} bind:group={selected} {value} on:change={() => handleChange(value)} />
            <label for={slugify(label)} class="relative block text-left pl-8 dark:text-white">
                {label}
                <span
                    class="absolute left-0 top-1/2 transform -translate-y-1/2 size-4 border border-gray-400 rounded-full flex items-center justify-center pointer-events-none"
                >
                    <span class="size-2 rounded-full bg-primary-500 transform scale-0 transition-transform"></span>
                </span>
            </label>
        </div>
    {/each}
</div>

<style>
    input[type='radio']:checked + label .size-2 {
        transform: scale(1);
    }

    input[type='radio']:focus + label .size-4 {
        box-shadow: 0 0 0 1px var(--primary-500);
    }

    input[type='radio']:disabled + label {
        color: #b0b0b0;
        cursor: not-allowed;
    }

    input[type='radio']:disabled + label .size-4 {
        background: #ccc;
    }

    label:hover {
        cursor: pointer;
    }
</style>
