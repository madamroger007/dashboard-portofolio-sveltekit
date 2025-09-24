<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { createEventDispatcher } from 'svelte';

  export let value = '';
  export let placeholder = 'Cari...';

  const dispatch = createEventDispatcher();

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    dispatch('change', target.value);
  }
</script>

<Input {placeholder} bind:value oninput={handleInput} class="max-w-sm" />
