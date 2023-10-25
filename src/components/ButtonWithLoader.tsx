import { Spinner } from "@/components";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  name?: string;
};

export default function ButtonWithLoader({
  title,
  className,
  loading,
  name,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      className={classNames(
        disabled == true ? "opacity-40" : "opacity-90 hover:opacity-100",
        className ? className : ""
      )}
      onClick={onClick}
      name={name}
      disabled={disabled ?? false}
    >
      {loading ? <Spinner /> : title}
    </button>
  );
}
