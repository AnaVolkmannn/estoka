'use client';

import FornecedorCrud from '@/components/FornecedoresCrud';
import ProductsCrud from '@/components/ProductsCrud';

export default function Page() {
  return (
    <>
      <div>
        <ProductsCrud />
      </div>
      <div>
        <FornecedorCrud />
      </div>
    </>
  );
}