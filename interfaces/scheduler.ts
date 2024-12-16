import { InjectionToken, StoppableService } from "../core";
import { MethodNames } from "../utilities/types";

export type SchedulerCallbackName<IService extends StoppableService> = Exclude<MethodNames<IService>, "stop" | "onStop">

export interface ISchedulerService {
	schedule<IService extends StoppableService>(node: IService, callback: SchedulerCallbackName<IService>, intervalMillis: number): void
}
export const scheduler = new InjectionToken<ISchedulerService>("Scheduler")
export interface WithSchedulerService {
	scheduler: ISchedulerService
}
