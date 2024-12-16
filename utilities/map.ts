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
