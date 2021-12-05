import React from "react";
import Container from "../components/container";
import {
  LegalHeader,
  LegalParagraph,
  LegalSubHeader,
} from "../components/lib/legal";

export default function PrivacyPolicy() {
  return (
    <Container>
      <LegalHeader title="Privacy Policy" />
      <LegalParagraph>
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you visit https://p2p.chat (the
        “Site”).
      </LegalParagraph>

      <LegalSubHeader title="PERSONAL INFORMATION WE COLLECT" />

      <LegalParagraph>
        When you visit the Site, we automatically collect certain information
        about your device, including information about your web browser, IP
        address, time zone, and some of the cookies that are installed on your
        device. Additionally, as you browse the Site, we collect information
        about the individual web pages or products that you view, what websites
        or search terms referred you to the Site, and information about how you
        interact with the Site. We refer to this automatically-collected
        information as “Device Information.”
      </LegalParagraph>

      <LegalParagraph>
        We collect Device Information using the following technologies:
      </LegalParagraph>

      <ul className="list-disc list-inside mb-5">
        <li>
          “Log files” track actions occurring on the Site, and collect data
          including your IP address, browser type, Internet service provider,
          referring/exit pages, and date/time stamps.
        </li>
      </ul>

      <LegalSubHeader title="HOW DO WE USE YOUR PERSONAL INFORMATION?" />

      <LegalParagraph>
        We use the Device Information that we collect to help us screen for
        potential risk and fraud (in particular, your IP address), and more
        generally to improve and optimize our Site (for example, by generating
        analytics about how our customers browse and interact with the Site, and
        to assess the success of our marketing and advertising campaigns).
      </LegalParagraph>

      <LegalParagraph>
        We share your Personal Information with third parties to help us use
        your Personal Information, as described above. For example, we use
        Cloudflare as a CDN and for DDOS protection -- you can read more about
        how Cloudflare uses your Personal Information here:
        https://www.cloudflare.com/privacypolicy/.
      </LegalParagraph>

      <LegalParagraph>
        Finally, we may also share your Personal Information to comply with
        applicable laws and regulations, to respond to a subpoena, search
        warrant or other lawful request for information we receive, or to
        otherwise protect our rights.
      </LegalParagraph>

      <LegalSubHeader title="DO NOT TRACK" />

      <LegalParagraph>
        Please note that we do not alter our Site’s data collection and use
        practices when we see a Do Not Track signal from your browser.
      </LegalParagraph>

      <LegalSubHeader title="YOUR RIGHTS" />

      <LegalParagraph>
        If you are a European resident, you have the right to access personal
        information we hold about you and to ask that your personal information
        be corrected, updated, or deleted. If you would like to exercise this
        right, please contact us through the contact information below.
        Additionally, if you are a European resident we note that we are
        processing your information in order to fulfill contracts we might have
        with you (for example if you make an order through the Site), or
        otherwise to pursue our legitimate business interests listed above.
        Additionally, please note that your information will be transferred
        outside of Europe, including to Canada and the United States.
      </LegalParagraph>

      <LegalSubHeader title="CHANGES" />

      <LegalParagraph>
        We may update this privacy policy from time to time in order to reflect,
        for example, changes to our practices or for other operational, legal or
        regulatory reasons.
      </LegalParagraph>

      <LegalSubHeader title="CONTACT US" />

      <LegalParagraph>
        For more information about our privacy practices, if you have questions,
        or if you would like to make a complaint, please contact us by e-mail at
        support@p2p.chat.
      </LegalParagraph>
    </Container>
  );
}
