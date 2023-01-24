import { writable } from 'svelte/store';
import type { User } from '../types/User';
import PocketBase from 'pocketbase';

export const loggedIn = writable(false);

function createUser() {
    return {
        name: "",
        username: "",
        password: "",
        email: ""
    }
}

export const user: User = createUser();

function createClient() {
    return new PocketBase()
}

export const client: PocketBase = createClient();
