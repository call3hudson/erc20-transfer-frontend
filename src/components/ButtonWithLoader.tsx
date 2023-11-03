import { Spinner } from "@/components";
import { classNames } from "@/utils";

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
        disabled == true || loading == true
          ? "opacity-40"
          : "opacity-90 hover:opacity-100",
        className ? className : ""
      )}
      onClick={onClick}
      name={name}
      disabled={disabled == true || loading == true ? true : false}
    >
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        title
      )}
    </button>
  );
}
