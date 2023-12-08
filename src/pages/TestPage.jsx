import styled from "@emotion/styled";

function Descriptor({children}) {
  return children;
}

function Parent({className}) {

  return <div className={className}>
    {[...Array(6)].map((x, y) => <Descriptor>
      <Child key={y} i={y}/>
    </Descriptor>)}

  </div>

}

function Child({i, className}) {
  return <p className={className}>{i}</p>;
}

// const StyledChild = styled(Child)``;

const StyledParent = styled(Parent)`
  background-color: lightblue;

  ${Child} {
    background-color: red;
  }
`;

export default function TestPage() {
  return <div>
    {/*<Swiper.View />*/}

    <Descriptor>
      <h1>Parent</h1>

      <StyledParent/>
    </Descriptor>

  </div>;
}
