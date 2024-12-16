export type MethodNames<TObj extends object, Fn = () => void> = keyof {
	[K in keyof TObj]: TObj[K] extends Fn ? TObj[K] : never
}
