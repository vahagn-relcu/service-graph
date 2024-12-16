import { InjectionToken, StoppableService } from "../core";

export interface ISchedulerService {
	schedule(node: StoppableService, callback: () => Promise<void>, intervalMillis: number): void
}
export const scheduler = new InjectionToken<ISchedulerService>("Scheduler")
export interface WithSchedulerService {
	scheduler: ISchedulerService
}
