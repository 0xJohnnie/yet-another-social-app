const CHAR_DISPLAYED = 6;

const shortenWalletAddress = (address: string) => {
  if (address) {
    const firstPart = address.slice(0, CHAR_DISPLAYED);
    const lastPart = address.slice(address.length - CHAR_DISPLAYED);

    return `${firstPart}...${lastPart}`;
  }

  return address;
};

export default shortenWalletAddress;
