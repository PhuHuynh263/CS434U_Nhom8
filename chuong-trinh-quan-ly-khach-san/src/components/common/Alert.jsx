import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Alert = ({ type = "info", title, message, onClose, show = true }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "error":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`rounded-lg border p-4 ${getStyles()}`}>
        <div className="flex">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            {title && <h3 className="text-sm font-medium">{title}</h3>}
            {message && (
              <div className={`text-sm ${title ? "mt-1" : ""}`}>{message}</div>
            )}
          </div>
          {onClose && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
};

export default Alert;
