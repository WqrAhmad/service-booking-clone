import Swal from 'sweetalert2';

export default class NotificationService {
  success(arg0: string) {
    console.log(arg0)
    throw new Error('Method not implemented.');
  }
  error(arg0: string) {
    console.log(arg0)
    throw new Error('Method not implemented.');
  }
  private readonly toast: any = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    position: 'top-end',
    timerProgressBar: true,
    timer: 3000,
    customClass: { container: 'toast' },
});;
  public showError(message: string, type='error') {
    return this.toast.fire({
        icon: type,
        title: message,
        padding: '10px 20px',
    });
  }

  public showSuccess(message: string, type='success') {
    return this.toast.fire({
        icon: type,
        title: message,
        padding: '10px 20px',
    });
  }

}
