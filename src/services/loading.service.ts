import { reactive } from 'vue';
import { TLoadingKey } from '../model/loading.model';
export default class LoadingService {
  public readonly loadings: Set<TLoadingKey> = reactive(new Set<TLoadingKey>());

  public startLoading(key: TLoadingKey): void {
    this.loadings.add(key);
  }

  public stopLoading(key: TLoadingKey): void {
    this.loadings.delete(key);
  }

  public isLoading(key: TLoadingKey): boolean {
    return this.loadings.has(key);
  }

  public isAnyLoadingWithPrefix(prefix: string): boolean {
    return Array.from(this.loadings).some((key) => key.startsWith(prefix));
  }
}
