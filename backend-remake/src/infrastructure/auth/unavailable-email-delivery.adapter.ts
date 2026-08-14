import { Injectable } from '@nestjs/common';
import { ApplicationError } from '../../application/errors/application.error';
import type { EmailDeliveryPort } from '../../application/auth/ports/email-delivery.port';

@Injectable()
export class UnavailableEmailDeliveryAdapter implements EmailDeliveryPort {
  sendPasswordReset(): Promise<void> {
    return Promise.reject(this.unavailable());
  }

  sendEmailVerification(): Promise<void> {
    return Promise.reject(this.unavailable());
  }

  private unavailable(): ApplicationError {
    return new ApplicationError('Email delivery is unavailable', {
      code: 'EMAIL_DELIVERY_UNAVAILABLE',
      kind: 'service_unavailable',
    });
  }
}
