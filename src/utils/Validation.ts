const validateAddress = (
  address: string
): { valid: boolean; error: string } => {
  if (address === null || address === undefined || address.length == 0)
    return { valid: false, error: "Address field is empty" };
  if (!address.startsWith("0x"))
    return { valid: false, error: "Address must starts with '0x'" };
  if (address.length != 42)
    return {
      valid: false,
      error: "Address length should be 42 characters long",
    };
  return { valid: true, error: "" };
};

const validateNumber = (amount: number): { valid: boolean; error: string } => {
  if (amount === null || amount === undefined || amount == 0)
    return { valid: false, error: "Amount should be greater than 0" };
  return { valid: true, error: "" };
};

export { validateAddress, validateNumber };
