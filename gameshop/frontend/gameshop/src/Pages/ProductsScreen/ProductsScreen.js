import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./ProductsScreen.module.css";
import { Context } from "../../utils/GameShopContext";
import ProductCard from "../../Components/ProductCard/ProductCard";
import AddCard from "../../Components/AddCard/AddCard";
import AstroSvg from "../../svg/AstroSvg";
import AddGameForm from "../../Components/AddGameForm/AddGameForm";
import BuyGameModal from "../../Components/BuyGameModal/BuyGameModal";
import EditProductForm from "../../Components/EditProductForm/EditProductForm";
import { PRODUCT_STATUS } from "../../constants/constants";
import FilterSvg from "../../svg/FilterSvg";
import FilterModal from "../../Components/FilterModal/FilterModal";
import LoaderSvg from "../../svg/LoaderSvg";
import SearchSvg from "../../svg/SearchSvg";

const ProductsScreen = () => {
  const { contract, account } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const accountAddress = location.state;
  const sourceData = useRef();
  const inputSearchRef = useRef();
  const [admin, setAdmin] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState({});
  const [addGameForm, setAddGameForm] = useState(false);
  const [buyGameModal, setBuyGameModal] = useState(false);
  const [editGameModal, setEditGameModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const checkIsUserAdmin = useCallback(async () => {
    const owner = await contract?.methods.getOwner().call();
    if (owner?.toLowerCase() === account) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [contract?.methods, account]);

  const getAvaliableGames = useCallback(async () => {
    setLoader(true);
    const games = [];
    const count = await contract?.methods.getGamesCount().call();
    for (let i = 0; i < Number(count); i++) {
      const game = await contract?.methods.getGameInfo(i).call();
      games.push(game);
    }
    sourceData.current = games;
    setGames(games);
    setLoader(false);
  }, [contract?.methods]);

  const openBuyGameModal = useCallback((data) => {
    setSelectedGame(data);
    setBuyGameModal(true);
  }, []);

  const openEditGameModal = useCallback((data) => {
    setSelectedGame(data);
    setEditGameModal(true);
  }, []);

  const openFilterModal = () => {
    setFilterModal(true);
  };

  const onProductsCardClick = useCallback(
    (data) => {
      return !admin ? openBuyGameModal(data) : openEditGameModal(data);
    },
    [admin, openBuyGameModal, openEditGameModal]
  );

  const openModal = useCallback(() => {
    setAddGameForm(true);
  }, []);

  const handleSearchByName = () => {
    if (inputSearchRef.current.value) {
      const input = inputSearchRef.current.value.toLowerCase();
      const data = sourceData?.current.filter(
        (el) => el.name.toLowerCase() === input
      );
      setGames(data);
    }
  };

  const renderGames = useMemo(() => {
    return games
      ?.filter(
        (el) =>
          Number(el.status) === PRODUCT_STATUS.AVAILABLE ||
          Number(el.status) === PRODUCT_STATUS.UNAVAILABLE
      )
      .reverse()
      .map((el, i) => (
        <ProductCard
          key={i}
          data={el}
          onClick={onProductsCardClick}
          canEdit={admin}
        />
      ));
  }, [games, onProductsCardClick, admin]);

  useLayoutEffect(() => {
    if (!accountAddress) {
      navigate("/");
      window.location.reload();
    }
  }, [navigate, accountAddress]);

  useEffect(() => {
    checkIsUserAdmin();
    getAvaliableGames();
  }, [checkIsUserAdmin, getAvaliableGames]);

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1>Products!</h1>
        <AstroSvg />
      </div>
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            ref={inputSearchRef}
            placeholder="Search by name"
            onChange={(e) => {
              if (!e.target.value) setGames(sourceData.current);
            }}
          />
          <SearchSvg
            className={styles.searchSvg}
            onClick={handleSearchByName}
          />
        </div>

        <div className={styles.filterButtonContainer}>
          <div className={styles.filterWrapper} onClick={openFilterModal}>
            <FilterSvg />
            <span>Filters</span>
          </div>
          <span
            onClick={() => setGames(sourceData?.current)}
            className={styles.clearFilter}
          >
            Clear all
          </span>
        </div>
      </div>
      <div className={styles.productsList}>
        {!loader ? (
          <>
            {admin ? <AddCard onClick={openModal} /> : null}
            {renderGames}
          </>
        ) : (
          <LoaderSvg className={styles.loader} />
        )}
      </div>
      <AddGameForm
        isOpen={admin && addGameForm}
        setIsOpen={setAddGameForm}
        callback={getAvaliableGames}
      />
      <BuyGameModal
        isOpen={!admin && buyGameModal}
        setIsOpen={setBuyGameModal}
        data={selectedGame}
        callback={getAvaliableGames}
      />
      <EditProductForm
        data={selectedGame}
        isOpen={admin && editGameModal}
        setIsOpen={setEditGameModal}
        callback={getAvaliableGames}
      />
      <FilterModal
        isOpen={filterModal}
        setIsOpen={setFilterModal}
        setGames={setGames}
        sourceData={sourceData}
      />
    </div>
  );
};

export default ProductsScreen;
