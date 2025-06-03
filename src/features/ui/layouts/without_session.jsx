function LayoutWithoutSession({ children }) {
  return (
    <>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export default LayoutWithoutSession;
