import { Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import Label from "../room/label";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  id: string;
  fallback: string;
  icon?: React.ReactElement;
  label: string;
  options: {
    value: string;
    text: string;
  }[];
  selectedOption:
    | {
        value: string;
        text: string;
      }
    | undefined;
  setValue: (value: string | undefined) => void;
}

export default function Select(props: Props) {
  const { id, fallback, icon, label, options, selectedOption, setValue } =
    props;

  const disabled = options.length === 0;

  const buttonClassName = classNames(
    "relative flex flex-row items-center w-full px-8 py-2 text-left text-black border rounded-md border-slate-300 focus:outline focus:outline-yellow-500",
    {
      "text-slate-500": disabled,
    }
  );

  return (
    <>
      <Label htmlFor={id} text={label} />
      <Listbox
        value={selectedOption?.value}
        onChange={setValue}
        disabled={disabled}
      >
        <div className="relative mt-1">
          <Listbox.Button
            id={id}
            className={buttonClassName}
            disabled={disabled}
          >
            <div className="absolute left-2">{icon}</div>
            <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedOption?.text ?? fallback}
            </div>
            <SelectorIcon className="absolute right-2" width={20} height={20} />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-60 border rounded-md border-slate-300 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option key={option.value} value={option.value}>
                {({ active, selected }) => {
                  const optionClassName = classNames(
                    "relative pl-8 p-2 cursor-pointer",
                    {
                      "bg-slate-200": active,
                    }
                  );

                  return (
                    <div className={optionClassName}>
                      {selected && (
                        <CheckIcon
                          className="absolute left-2"
                          width={20}
                          height={20}
                        />
                      )}
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.text}
                      </div>
                    </div>
                  );
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </>
  );
}
