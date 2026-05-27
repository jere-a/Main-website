<script lang="ts">
  import { user, username, gun, timestate } from '@/ts/user';
  import { createAvatar } from '@dicebear/core';
  import { initials } from '@dicebear/collection';
  import { onMount } from 'svelte';
  import type { IGunChain, GunCallbackUserCreate, GunDataNode } from 'gun/types';

  let usernameInput = $state('');
  let passwordInput = $state('');

  const avatar = $derived(createAvatar(initials, {
    seed: $username,
    size: 128,
  }).toDataUri());

  function signout() {
    user.leave()
    username.set('')
  }

  function login() {
    user.auth(usernameInput, passwordInput);
  }

  function signup() {
    user.create(usernameInput, passwordInput, (err: GunCallbackUserCreate) => {
      if (err) {
        alert(err);
      } else {
        login();
      }
    })
  }


  type comment = {
    who: IGunChain<any,any,any,'alias'>;
    what: string;
    when: number;
  }

  let newMessage = $state('');
  let comments: comment[] = $state([]);

  function sendComment(event: SubmitEvent & {currentTarget: EventTarget & HTMLFormElement}) {
    event.preventDefault();
    const comment = user.get('all').set({ what: newMessage });
    const index = new Date().toISOString();
    gun.get('comments').get(index).put(comment);
    newMessage = ''
  }

  onMount(() => {
    gun.get('comments').map().once(async (data, _) => {
        let comment: comment = {
          who: gun.user(data).get('alias'),
          what: data?.what,
          when: timestate
        }

        if (comment.what) {
          comments = [...comments.slice(-100), comment];
        }
    })
  })
</script>

{#if $username}
  <div class="user-bio">
    <span><strong>{$username}</strong></span>
    <img src={avatar} alt="Avatar">
  </div>

  <form onsubmit={sendComment}></form>

  <button class="signout-button" onclick={signout}>Sign Out</button>
{:else}
  <label for="username">Username</label>
  <input name="username" type="text" bind:value={usernameInput} minlength="3" maxlength="16">

  <label for="password">Password</label>
  <input name="password" type="password" bind:value={passwordInput}>

  <button class="login" onclick={login}>Login</button>
  <button class="login" onclick={signup}>Sign Up</button>
{/if}

{#each comments as comment (comment.when)}
  <div>
    <h3>{$username}</h3>
    <p>{comment}</p>
  </div>
{/each}
