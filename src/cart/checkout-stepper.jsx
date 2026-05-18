import React from "react";
import { IoCheckmark } from "react-icons/io5";

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Cart" },
    { id: 2, label: "Address" },
    { id: 3, label: "Payment" },
    { id: 4, label: "Complete" },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center justify-between min-w-[650px] md:min-w-full max-w-4xl mx-auto px-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative flex-shrink-0">
              <div
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 text-sm md:text-base font-semibold transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-[#063352] border-[#063352] text-white"
                    : "bg-gray-200 border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <IoCheckmark size={20} />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`mt-3 text-[11px] md:text-sm font-semibold whitespace-nowrap transition-colors ${
                  currentStep >= step.id
                    ? "text-[#063352]"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-200 mx-2 md:mx-4 relative overflow-hidden rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-[#063352] transition-all duration-500"
                  style={{
                    width: currentStep > step.id ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutStepper;