import useTranslation from 'next-translate/useTranslation';
import medium from '../../public/Medium.svg';
import pdf from '../../public/pdf.svg';

import { FancyButton } from '../Buttons';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH2 } from '../Title';

const LimitedWindow = () => {
  const { t } = useTranslation('home');

  return <DeltaSection title={t('limitedWindow')}>
    <DeltaPanel>
      <DeltaTitleH2>
        <div>{t('deltaAcademy')}</div>
      </DeltaTitleH2>
      <div className="mt-6">
        <FancyButton
          url="https://link.medium.com/w9qBWOVQKdb"
          text="Introducing Delta"
          image={medium}
        />
        <FancyButton
          url="https://link.medium.com/GLMhwp8d3db"
          text="Limited Staking Window"
          image={medium}
        />
        <FancyButton
          url="https://gateway.pinata.cloud/ipfs/Qmaf1WduB8mzYoL5nqAvcTh4tvf7RqaRBTWZohM2oC9jBg/Delta_Summary.pdf"
          text="Delta Onepager"
          image={pdf}
        />
      </div>
    </DeltaPanel>
  </DeltaSection>;
};

export default LimitedWindow;
