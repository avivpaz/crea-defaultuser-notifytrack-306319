# USPS Notify

A service that allows users to track their USPS packages and receive real-time notifications on status updates.

## Features

- Easy tracking with USPS tracking number
- Real-time notifications via email or SMS
- Secure payment processing with PayPal
- Automated status updates

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, React Hook Form
- **Backend**: AWS Lambda, API Gateway, DynamoDB
- **Notifications**: Amazon SNS
- **Payment**: PayPal SDK
- **Tracking**: USPS Web Tools API

## Prerequisites

- Node.js 18 or later
- AWS Account with appropriate permissions
- USPS Web Tools API account
- PayPal Developer account

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/usps-notify.git
   cd usps-notify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   - Add your PayPal Client ID
   - Add your USPS Web Tools API User ID
   - Configure AWS credentials and settings

5. Set up AWS resources:
   - Create a DynamoDB table named 'usps_tracking'
   - Create an SNS topic for notifications
   - Configure appropriate IAM roles and permissions

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AWS Infrastructure Setup

1. DynamoDB Table Structure:
   - Primary Key: trackingNumber (String)
   - Attributes:
     - notificationType (String)
     - contactInfo (String)
     - paymentId (String)
     - status (String)
     - createdAt (String)
     - updatedAt (String)

2. SNS Topic:
   - Create a topic for notifications
   - Configure appropriate access policies

3. Lambda Functions (to be implemented):
   - Tracking Update Checker (runs on schedule)
   - Notification Dispatcher

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel, AWS Amplify)

## Environment Variables

- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: PayPal Client ID for payment processing
- `USPS_USER_ID`: USPS Web Tools API User ID
- `AWS_REGION`: AWS Region for services
- `AWS_ACCESS_KEY_ID`: AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key
- `AWS_SNS_TOPIC_ARN`: ARN of the SNS topic for notifications
- `DYNAMODB_TABLE_NAME`: Name of the DynamoDB table

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# notifytrack
