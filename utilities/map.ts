export function mapSetBind<TKey, TValue>(
	map: Map<TKey, TValue>,
	key: TKey,
	defaultValue: NoInfer<TValue>,
	bind: (value: TValue) => TValue,
) {
	if (map.has(key)) {
		const newValue = bind(map.get(key)!);
		map.set(key, newValue);
	} else {
		map.set(key, bind(defaultValue));
	}
}

export function mapGetBind<TKey, TValue>(
	map: Map<TKey, TValue>,
	key: TKey,
	bind: (key: TKey) => TValue = (key) => { throw new Error("Key " + String(key) + " not in map") },
): TValue {
	if (map.has(key)) {
		return map.get(key)!;
	} else {
		const value = bind(key);
		map.set(key, value);
		return value
	}
}

export function randomString(length = 12) {
	const letters = [
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	]

	return new Array(length).fill(null).map(() => randomChoice(letters)).join("")
}

export function randomChoice<T>(array: T[]): T {
	const index = Math.floor(Math.random() * array.length)
	return array[index]
}
