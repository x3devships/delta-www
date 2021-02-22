import useTranslation from 'next-translate/useTranslation';
import medium from '../../public/Medium.svg';

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
      <DeltaPanel>
        <FancyButton
          url="https://medium.com/delta-financial/introducing-delta-financial-769d387e9430"
          text="ANNOUNCING DELTA"
          image={medium}
        />
        <FancyButton
          url="https://medium.com/delta-financial/delta-tokenizing-open-vested-liquidity-7b115d03fb5"
          text="DELTA BASICS"
          image={medium}
        />
        <FancyButton
          url="https://medium.com/delta-financial/deep-farming-vault-yield-maximizing-strategy-a453a24a68d4"
          text="HOW TO PARTICIPATE"
          image={medium}
        />
      </DeltaPanel>
    </DeltaPanel>
  </DeltaSection>;
};

export default LimitedWindow;
