import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "@/service/service";
import { BASE_URL } from "@/service/service";
import { useAppDispatch } from "@/store/hooks";
import { setNotifyMsg } from "@/store/reducers/share";

const stripePromise = loadStripe(
  "pk_test_51NywJ7B6zGBDQPnqttClPsJSn3ot2BfqW8NIY5sgyChLFH1vAVh3JeTuu5CTct7cCIxoMjUtf45PSBqS0OejneWG00OQJa4uVq"
);

const options = {
  iconStyle: "solid",
  style: {
    base: {
      lineHeight: "32px",
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: "16px",
      padding: "15px",
      "::placeholder": {
        color: "#8898AA",
      },
    },
    invalid: {
      iconColor: "#e85746",
      color: "#e85746",
    },
  },
  classes: {
    focus: "is-focused",
    empty: "is-empty",
  },
};

const CardSetupForm = ({ plan, ...props }) => {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const [cardErr, setCardErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [carHolderName, setCardHolderName] = useState("");
  const dispatch = useAppDispatch();

  const handleCardSetup = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (elements == null || stripe == null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setLoading(false);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await axios.get(BASE_URL + "/getCustomer");

    const data = res.data;

    stripe
      .confirmCardSetup(data, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: carHolderName,
          },
        },
      })
      .then(async (result) => {
        // console.log('confirm result', result);
        // return;
        if (result.error) {
          setLoading(false);

          dispatch(setNotifyMsg(result.error.message));
        } else {
          setLoading(false);
          console.log(result.setupIntent.payment_method);
          const res = await axios.post(BASE_URL + "/subscribe", {
            plan,
            tokenInput: result.setupIntent.payment_method,
          });
          const data = res.data;
          if (data === "success") {
            dispatch(setNotifyMsg("Payment Success."));
            navigate("/user/go-pro");
          } else dispatch(setNotifyMsg("Payment Failed."));
        }
      });
  };

  const onCardElementChange = (event: any) => {
    let errorMsg = "";
    if (event.error) {
      errorMsg = event.error.message;
    } else {
      errorMsg = "";
    }
    setCardErr(errorMsg);
  };

  return (
    <div className="rounded-2xl bg-gray-50 py-10 ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:py-16">
      <div className="mx-auto max-w-xs px-8">
        <form onSubmit={handleCardSetup}>
          <p className="text-base font-semibold text-gray-600 mb-4">
            Payment Information
          </p>
          <div className="mb-2">
            <input
              placeholder="Cardholder Name"
              className="w-full border border-gray rounded-md p-2 focus:outline-none"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCardHolderName(e.target.value)
              }
            />
          </div>

          <div className="p-2 mb-1">
            <CardElement onChange={onCardElementChange} s />
          </div>

          <div className="text-sm text-red-600 mb-2">{cardErr}</div>

          <img
            src="https://expressexpense.com/img/others/secure-stripe-payment-logo.png"
            alt="stripe-logo"
            className="mb-2"
          />
          <hr />
          <button
            disabled={loading}
            type="submit"
            className="mt-10 float-right block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

const Payment = () => {
  const params = useParams();

  return (
    <div className="w-full h-full px-2 py-8">
      <div className="flex flex-col w-full md:flex-row max-w-xl md:max-w-5xl mx-auto my-2 justify-center gap-4">
        {params.plan === "pro-plan" && (
          <div className="relative rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-gray-600">
                PROFESSIONAL
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  $13.99
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  / month
                </span>
              </p>
              <ul className="mt-6 text-xs leading-5 text-gray-600">
                <li>
                  <strong>ALL Templates (100+)</strong>
                </li>
                <li>Create Unlimited Graphics</li>
                <li>PNG, JPG Download</li>
                <li>Unlimited Saved Designs</li>
                <li>Custom Image Upload</li>
              </ul>
            </div>
          </div>
        )}
        {params.plan === "pro-plan-annual" && (
          <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-gray-600">
                PROFESSIONAL
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  $75.99
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  / year
                </span>
              </p>
              <ul className="mt-6 text-xs leading-5 text-gray-600">
                <li>
                  <strong>ALL Templates (100+)</strong>
                </li>
                <li>Create Unlimited Graphics</li>
                <li>PNG, JPG Download</li>
                <li>Unlimited Saved Designs</li>
                <li>Custom Image Upload</li>
              </ul>
            </div>
          </div>
        )}

        <Elements stripe={stripePromise} options={options}>
          <CardSetupForm plan={params.plan} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
