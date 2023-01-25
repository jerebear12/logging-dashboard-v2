import { writable } from 'svelte/store';
import type { User } from '../types/User';
import PocketBase from 'pocketbase';
import type { Logger } from '../types/Logger';

export const loggedIn = writable(false);

function createUser() {
	const { subscribe, set, update } = writable<User>({
		password: '',
		email: ''
	});

	return {
		subscribe,
		set: (user: User) => set(user),
		setPassword: (password: string) =>
			update((n) => {
				n.password = password;
				return n;
			}),
		setEmail: (email: string) =>
			update((n) => {
				n.email = email;
				return n;
			})
	};
}

export const user = createUser();

function createClient() {
	const { subscribe, set, update } = writable<PocketBase>(new PocketBase());

	return {
		subscribe,
		setURL: (URL: string) =>
			update((n): PocketBase => {
                n.baseUrl = '';
				n.baseUrl = URL;
				return n;
			}),
		setClient: (client: PocketBase) => set(client)
	};
}

export const pb = createClient();

function createLoggersList() {
	const { subscribe, set, update } = writable<Logger[]>([
		{
			name: '',
			url: ''
		}
	]);

	return {
		subscribe,
		set: (loggers: Logger[]) => set(loggers),
		append: (logger: Logger) => update((n) => { n.push(logger); return n; } ),
		remove: (index: number) => update((n) => { n.splice(index, 1); return n; })
	};
}

export const loggers = createLoggersList();
