import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Phone,
  PhoneOff,
  Moon,
  Sun,
  Home,
  Calculator,
  Building,
  House,
  Construction,
  Repeat,
} from "lucide-react";
import Vapi from "@vapi-ai/web";

const CallButton = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [propertyType, setPropertyType] = useState("Residential");
  const [selectedRobot, setSelectedRobot] = useState({
    name: "Real Estate Robot",
    assistantId: "ec1032e5-7bf8-4e69-a165-f77efed94588",
    apiKey: "4712e393-1100-4981-813a-62981dba89a3",
    icon: <Home size={20} />,
  });

  const robots = [
    {
      name: "Real Estate Robot",
      assistantId: "ec1032e5-7bf8-4e69-a165-f77efed94588",
      apiKey: "4712e393-1100-4981-813a-62981dba89a3",
      icon: <Home size={20} />,
    },
    {
      name: "Accounting Robot",
      assistantId: "ca8e0500-7c53-42c4-9b40-1bb5040245ba",
      apiKey: "18a97910-ef4a-480d-b238-a313b9700e5a",
      icon: <Calculator size={20} />,
    },
  ];

  const propertyTypes = [
    { id: "Residential", name: "Residential", icon: <House size={16} /> },
    { id: "Commercial", name: "Commercial", icon: <Building size={16} /> },
    {
      id: "PreConstruction",
      name: "Pre Construction",
      icon: <Construction size={16} />,
    },
    { id: "Assignment", name: "Assignment", icon: <Repeat size={16} /> },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCall = async () => {
    // Validate customer name for Real Estate Robot
    if (selectedRobot.name === "Real Estate Robot" && !customerName.trim()) {
      toast.error("Please enter a customer name");
      return;
    }

    const toastId = toast.loading(
      `Please wait while we connect you to ${selectedRobot.name}`
    );

    if (!isCalling) {
      try {
        const vapi = new Vapi(selectedRobot.apiKey);

        // Apply assistant overrides only for Real Estate Robot
        if (selectedRobot.name === "Real Estate Robot") {
          let route = "";
          let offer = "";

          // Set route and offer based on property type
          switch (propertyType) {
            case "Commercial":
              route =
                "   - The user is looking TO BUY OR SELL A COMMERCIAL PROPERTY so proceed to step 4.0.";
              offer =
                "   - Let them know that you are Lisa, a Client Care specialist from Realty Wealth Group and the reason for your call is they had left their information for us to contact them for buying,.,.,. leasing.,.,.,. or selling a commercial property. then ask if that is correct.";
              break;
            case "Assignment":
              route =
                "   - The user is LOOKING FOR ASSIGNMENT so proceed to step 6.";
              offer =
                "   - Let them know that you are Lisa, a Client Care specialist from Realty Wealth Group the reason for your call today is that you received their information because they were interested in selling their pre-construction home or condo before closing. Ask if they are still interested?";
              break;
            case "PreConstruction":
              route =
                "   - The user is LOOKING FOR A PRE CONSTRUCTION so proceed to step 5.";
              offer =
                "   - Let them know that you are Lisa, a Client Care specialist from Realty Wealth Group and the reason for your call is that you received their information because they were interested in buying a preconstruction Home or condo. Ask them if their still interested?";
              break;
            case "Residential":
              route =
                "   - The user is looking TO BUY OR SELL A RESIDENTIAL PROPERTY so proceed to step 3.0. ";
              offer =
                "   - Let them know that you are Lisa, a client care specialist from Realty Wealth Group and the reason for your call is they had left their information for us to contact them for buying or selling their home.";
              break;
            default:
              route =
                "   - The user is looking TO BUY OR SELL A RESIDENTIAL PROPERTY so proceed to step 3.0. ";
              offer =
                "   - Let them know that you are Lisa, a client care specialist from Realty Wealth Group and the reason for your call is they had left their information for us to contact them for buying or selling their home.";
          }

          const assistantOverrides = {
            variableValues: {
              name: customerName,
              route: route,
              offer: offer,
            },
          };
          await vapi.start(selectedRobot.assistantId, assistantOverrides);
        } else {
          await vapi.start(selectedRobot.assistantId);
        }

        setIsCalling(true);
        toast.update(toastId, {
          render: `You are now connected to ${selectedRobot.name}`,
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error starting call:", error);
        toast.update(toastId, {
          render: "Failed to connect. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } else {
      try {
        const vapi = new Vapi(selectedRobot.apiKey);
        vapi.stop();
        setIsCalling(false);
        window.location.reload();
        toast.update(toastId, {
          render: "Call ended",
          type: "info",
          isLoading: false,
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error stopping call:", error);
        setIsCalling(false);
        toast.update(toastId, {
          render: "Error ending call",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  };

  const handleRobotChange = (robot) => {
    if (!isCalling) {
      setSelectedRobot(robot);
      // Reset customer name when switching away from Real Estate
      if (robot.name !== "Real Estate Robot") {
        setCustomerName("");
      }
    } else {
      toast.warning("Please end current call before switching robots");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen font-sans transition-colors duration-300 px-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 focus:outline-none"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun size={24} className="text-yellow-400" />
        ) : (
          <Moon size={24} className="text-gray-600" />
        )}
      </button>

      {/* Title */}
      <h1
        className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Real Caller AI Demo Page
      </h1>

      {/* Robot Selection */}
      <div className="mb-6 w-full max-w-md">
        <p
          className={`text-sm mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Select an AI assistant:
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {robots.map((robot) => (
            <button
              key={robot.assistantId}
              onClick={() => handleRobotChange(robot)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedRobot.assistantId === robot.assistantId
                  ? darkMode
                    ? "bg-[#8053e0] text-white"
                    : "bg-[#8053e0] text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } ${isCalling ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isCalling}
            >
              <span className="mr-2">{robot.icon}</span>
              {robot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Real Estate Specific Options */}
      {selectedRobot.name === "Real Estate Robot" && (
        <div className="w-full max-w-md mb-6 space-y-4">
          {/* Customer Name Input */}
          <div>
            <label
              htmlFor="customerName"
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
              }`}
              disabled={isCalling}
            />
          </div>

          {/* Property Type Selection */}
          <div>
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Property Type:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => !isCalling && setPropertyType(type.id)}
                  className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    propertyType === type.id
                      ? darkMode
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } ${isCalling ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isCalling}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call Button */}
      <div className="text-center w-full max-w- flex flex-col items-center justify-center">
        <button
          onClick={handleCall}
          className={`w-full sm:w-auto flex items-center justify-center px-6 py-4 text-lg font-medium transition duration-300 ease-in-out transform rounded-full shadow-lg ${
            isCalling
              ? "bg-red-500 hover:bg-red-600 text-white"
              : darkMode
              ? "bg-[#8053e0] hover:bg-blue-700 text-white"
              : "bg-[#8053e0] hover:bg-[#8053e0] text-white"
          } hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCalling ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        >
          <span className="mr-2">
            {isCalling ? <PhoneOff size={24} /> : <Phone size={24} />}
          </span>
          {isCalling ? "End Call" : "Start Call"}
        </button>

        <p
          className={`mt-4 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {isCalling
            ? `You are connected to ${selectedRobot.name}`
            : `Click to speak with ${selectedRobot.name}`}
        </p>

        {/* Show property type and customer info when calling Real Estate */}
        {isCalling && selectedRobot.name === "Real Estate Robot" && (
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Discussing {propertyType} properties with {customerName}
          </p>
        )}
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default CallButton;
