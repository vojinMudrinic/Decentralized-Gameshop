import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { Context } from "../../utils/GameShopContext";
import Admin from "./Admin/Admin";
import User from "./User/User";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const location = useLocation();
  const accountAddress = location.state;
  const { contract, account } = useContext(Context);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  const checkIsUserAdmin = useCallback(async () => {
    const owner = await contract?.methods.getOwner().call();
    if (owner?.toLowerCase() === account) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [contract?.methods, account]);

  useLayoutEffect(() => {
    if (!accountAddress) {
      navigate("/");
      window.location.reload();
    }
  }, [navigate, accountAddress]);

  useEffect(() => {
    checkIsUserAdmin();
  }, [checkIsUserAdmin]);

  return <>{admin ? <Admin /> : <User />}</>;
};

export default ProfileScreen;
