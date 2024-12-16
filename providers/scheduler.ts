import { BaseProvider, ProviderNode, StoppableService } from "../core";
import { ISchedulerService, scheduler } from "../interfaces/scheduler";

export const schedulerProvider = new ProviderNode({
	dependsOn: {},
	provides: scheduler,
	provider: async (module) => {
		return SchedulerProvider.init(module)
	}
});

type SchedulerProviderOptions = {}
class SchedulerProvider extends BaseProvider<SchedulerProviderOptions> implements ISchedulerService {
	public static async init(module: SchedulerProviderOptions) {
		return new SchedulerProvider(module)
	}

	public schedule(node: StoppableService, callback: () => Promise<void>, intervalMillis: number): void {
		node.onStop

	    
	}
}
