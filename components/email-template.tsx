interface EmailProps {
  title: string;
  subtitle: string;
  code: string;
}

const EmailTemplate = ({ title, subtitle, code }: EmailProps) => `
  <table style="width: 600px; margin: 0 auto; max-width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 48px 64px 16px;">
          <p style="font-family: Helvetica, Arial, sans-serif; font-size: 24px;">
            ${process.env.NEXT_PUBLIC_APP_NAME}
          </p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top; text-align: left; padding: 0px 64px;">
          <h1
            style="
              text-align: left;
              font-style: normal;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 32px;
              font-weight: bold;
            "
          >
            ${title}
          </h1>
          <p
            style="
              text-align: left;
              margin: 32px 0px 0px;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
            "
          >
            ${subtitle}
          </p>
          <p
            style="
              margin: 16px 0px 0px;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 40px;
            "
          >
            <b>${code}</b>
          </p>
          <p
            style="
              margin: 16px 0px 0px;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
            "
          >
            To protect your account, do not share this code.
          </p>
          <p
            style="
              margin: 64px 0px 0px;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
            "
          >
            <b>Didn't request this? You can just ignore this email.</b>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
`;
export default EmailTemplate;
