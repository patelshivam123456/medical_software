import { TruckIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/20/solid';

const features = [
  {
    name: 'Fast & Reliable Delivery',
    description:
      'Get your medicines delivered to your doorstep on time, every time. We ensure same-day or next-day delivery in most areas.',
    icon: TruckIcon,
  },
  {
    name: '100% Genuine Medicines',
    description:
      'We partner directly with licensed pharmacies and distributors to ensure every product is safe and verified.',
    icon: ShieldCheckIcon,
  },
  {
    name: '24/7 Order Support',
    description:
      'Whether it’s late night or early morning, our support team is always available to assist you with your orders.',
    icon: ClockIcon,
  },
];

const FeatureSection = () => {
  return (
    <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-green-400">Our Vision</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Making Healthcare Accessible
              </p>
              <p className="mt-6 text-lg text-gray-300">
                We aim to revolutionize the way you access healthcare products by combining technology with trust.
                From life-saving medications to wellness essentials, we bring everything to your fingertips.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base text-gray-400 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon className="absolute top-1 left-1 size-5 text-green-400" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Healthcare Vision"
            src="/vision.jpg"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
