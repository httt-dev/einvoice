import { ProcessId } from '@common/decorators/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Controller, Post, RawBodyRequest, Req, Headers } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { StripeWebhookService } from '../services/stripe-webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
    constructor(private readonly stripeWebhookService: StripeWebhookService) {}

    @Post('stripe')
    @ApiOperation({ summary: 'Handle Stripe Webhook' })
    @ApiOkResponse({ type: ResponseDto<string>, description: 'Stripe webhook received successfully' })
    async stripeWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
        @ProcessId() processId: string,
    ) {
        await this.stripeWebhookService.processWebhook({ processId, rawBody: req.rawBody, signature });

        return Response.success<string>('Stripe webhook received successfully');
    }
}
