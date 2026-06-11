import { AxiosResponse } from 'axios';
import { Name, parseFullName } from 'parse-full-name';

export default class HelperService {

  public static async unwrapAxiosResponse<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    const response: AxiosResponse<T> = await request;

    return response.data;
  }

  public static capitalizeFirstLetter(string: string): string {
    if (!string) {
      return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static async toBlob(dataURI: string): Promise<Blob> {
    const data: Response = await fetch(dataURI);
    return data.blob();
  }

  public static parseFullName(fullName: string): Name {
    return parseFullName(fullName);
  }

  public static containsIgnoredRowElements(event: Event): boolean {
    if (!(event.target instanceof HTMLElement)) {
      return false;
    }

    const isClickedOnCheckbox: boolean = event.target.classList.contains(
      'ui_kit-shipvagoo_checkbox--box',
    );

    const isClickedOnButton: boolean =
      event.target.classList.contains('ui_kit-shipvagoo_button') ||
      event.target.classList.contains('q-btn__content');

    const isClickedOnIcon: boolean = event.target.classList.contains('q-icon');

    return isClickedOnCheckbox || isClickedOnButton || isClickedOnIcon;
  }

  public static addStar(label?: string): string | undefined {
    if (!label) {
      return undefined;
    }

    return `${label}*`;
  }

  public static switchToDarkColorScheme(): void {
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
  }

  public static switchToLightColorScheme(): void {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  }
}
