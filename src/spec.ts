import { async } from './index';

interface Data {
	user: { name: string[], age: number };
}

const data: Data = { user: { name: ['foo'], age: 21 } };

describe('async', () => {
	it('returns curried promise from non-promise value', async () => {
		const twentyOne = await async(21);
		expect(twentyOne).toBe(21);
	});

	it('returns curried promise from value wrapped in promise-like', async () => {
		const promise = Promise.resolve(data);
		const name = await async<Data>(promise).user.name[0].toUpperCase().split('');
		expect(name).toEqual(['F', 'O', 'O']);
	});

	it('returns curried promise from function that returns promise-like', async () => {
		const getPromise = () => new Promise<Data>((resolve) => {
			setTimeout(resolve, 200, data);
		});
		const name = await async<Data>(getPromise).user.name.at(0);
		expect(name).toBe('foo');
	});

	it('creates independent promises', async () => {
		const promise = Promise.resolve(data);
		const name = async<Data>(promise).user.name[0];
		const upperName = name.toUpperCase();
		const arr = upperName.split('');

		const result = await Promise.all([name, upperName, arr]);
		expect(result).toEqual(['foo', 'FOO', ['F', 'O', 'O']]);
	});

	it('unwraps promise-like objects so that it is possible to have a chain of these promise-likes', async () => {
		const end = {
			end() {
				return { then(cb: (n: number) => void) { cb(21) } };
			}
		};

		const process = {
			process() {
				return new Promise<typeof end>(resolve => setTimeout(resolve, 1e3, end));
			},
		};

		const chain = {
			start() {
				return Promise.resolve(process);
			},
		};

		const twentyOne = await async(chain).start().process().end();
		expect(twentyOne).toBe(21);
	});
});
