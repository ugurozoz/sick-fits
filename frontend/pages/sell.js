import CreateProduct from '../components/createProduct';
import PleaseSignIn from '../components/PleaseSignIn';

export default function SellPage() {
  return (
    <div>
      <PleaseSignIn>
        <CreateProduct />
      </PleaseSignIn>
    </div>
  );
}
