import { async } from './index';
import { expectType } from './utils';

interface Data {
	user: { name: string[], age: number };
}

const data: Data = { user: { name: ['foo'], age: 21 } };

describe('async', () => {
	it('Returns curried promise from non-promise value', async () => {
		const value = await async(21);
		expect(value).toBe(21);
    expectType<number, typeof value>();
	});

	it('Returns curried promise from value wrapped in promise-like', async () => {
		const promise = Promise.resolve(data);
		const value = await async<Data>(promise).user.name.at(0)?.toUpperCase().split('');
		expect(value).toEqual(['F', 'O', 'O']);
    expectType<string[] | undefined, typeof value>();
	});

	it('Returns curried promise from function that returns promise-like', async () => {
		const getPromise = () => new Promise<Data>((resolve) => {
			setTimeout(resolve, 200, data);
		});
		const value = await async<Data>(getPromise).user.name.at(0);
		expect(value).toBe('foo');
    expectType<string | undefined, typeof value>();
	});

	it('Creates independent promises', async () => {
		const promise = Promise.resolve(data);
		const name = async<Data>(promise).user.name[0];
		const upperName = name.toUpperCase();
		const arr = upperName.split('');

		const result = await Promise.all([name, upperName, arr]);
		expect(result).toEqual(['foo', 'FOO', ['F', 'O', 'O']]);
    expectType<[string, string, string[]], typeof result>();
	});

	it('Unwraps promise-like objects so that it is possible to have a chain of these promise-likes', async () => {
		const end = {
			end(): PromiseLike<number> {
				return { then(cb: (n: number) => any): any { cb(21); } };
			}
		};

		const process = {
			process() {
				return new Promise<typeof end>((resolve) => setTimeout(() => resolve(end), 1e3));
			},
		};

		const chain = {
			start() {
				return Promise.resolve(process);
			},
		};

		const value = await async(chain).start().process().end();
		expect(value).toBe(21);
    expectType<number, typeof value>();
	});
});
