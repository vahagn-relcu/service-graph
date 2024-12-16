import { BaseProvider, ProviderNode, StoppableService } from "../core";
import { ISchedulerService, scheduler, SchedulerCallbackName } from "../interfaces/scheduler";

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

	public schedule<IService extends StoppableService>(node: IService, callback: SchedulerCallbackName<IService>, intervalMillis: number): void {
		const interval = setInterval(() => {
			(node[callback] as () => void)()
		}, intervalMillis)
		node.onStop(() => clearInterval(interval))
	}
}
