import { useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { AppContext } from "../context/AppContext";

interface UserAddressNavProps {
  address: string;
}

export const UserAddressNav = ({ address }: UserAddressNavProps) => {
  const { setShowAllStakedTokens } = useContext(AppContext);
  return (
    <Alert key="secondary" variant="secondary">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <span>
          Welcome:{" "}
          <a
            href={`https://polygonscan.com/address/${address}`}
            target="_blank"
          >
            {address && address.substring(0, 10)} . . .
          </a>
        </span>
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Show all staked tokens"
            onChange={(e) => setShowAllStakedTokens(e.target.checked)}
          />
        </Form>
      </div>
    </Alert>
  );
};
