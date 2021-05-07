import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ query }) {
  console.log('query:', query);
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
