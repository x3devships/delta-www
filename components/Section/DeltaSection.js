import chevron from '../../public/chevron.svg';
import { DeltaTitleH1 } from '../Title';

const DeltaSection = ({ title, children, center }) => {
  return <section className="w-full border-2 mt-4 border-black py-9 px-3 md:px-9 m-auto">
    <main>
      <div className="flex py-4">
        <DeltaTitleH1 className={`${center && "md:text-center"} mr-6 md:mr-0`}>{title}</DeltaTitleH1>
        <img className="mr-4 self-start" src={chevron} alt="chevron" />
      </div>
      {children}
    </main>
  </section>;
}

export default DeltaSection