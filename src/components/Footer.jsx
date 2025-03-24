const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContent">
        <p>© {new Date().getFullYear()}</p>
        <a href="https://agozavia-portfolio.netlify.app/" target="_blank">
          <img src="/faviconAZM.ico" alt="logoAZM" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
