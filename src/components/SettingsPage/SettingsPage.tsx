import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Box,
  Button,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../../authGuard/AuthGuard";
import PageLoading from "../../common/PageLoading";
import { enums } from "../../enum";
import ApiServices from "../../services/ApiServices";
import { IAliExpress, ISallaAccount } from "../../types/common";
import Utils from "../../utils/utils";
import MenuAppBar from "../MenuAppBar/MenuAppBar";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface ISettingsPageState {
  aliExpress: IAliExpress;
  sallaAccount: ISallaAccount;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}




function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SettingsPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { user, isAuthenticated } = useAuth0();
  const [objSetting, setObjSetting] = useState<ISettingsPageState>({
    aliExpress: {
      appID: "",
      secretKey: "",
    },
    sallaAccount: {
      clientID: "",
      clientSecretKey: "",
    },
  });

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("xl"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const configureSettingObjects = (obj: Partial<ISettingsPageState>) => {
    setObjSetting((prevState) => {
      return {
        aliExpress: {
          ...prevState.aliExpress,
          ...(obj.aliExpress || {}),
        },
        sallaAccount: {
          ...prevState.sallaAccount,
          ...(obj.sallaAccount || {}),
        },
      };
    });
  };

  const onHandleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (
        objSetting.aliExpress.appID &&
        objSetting.aliExpress.secretKey &&
        objSetting.sallaAccount.clientID &&
        objSetting.sallaAccount.clientSecretKey
      ) {
        const io: any = {
          settingID: user?.sub,
          aliExpress: objSetting.aliExpress,
          sallaAccount: objSetting.sallaAccount,
        };

        const result = await ApiServices.saveSettings(io);
        if (result.isError) {
          throw new Error(
            result.message || "Error occurred while saving settings!"
          );
        }

        Utils.showSuccessMessage(result.message);
      } else {
        Utils.showErrorMessage("Please complete both sections.!");
      }
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const settingID = user?.sub;
      const result = await ApiServices.getSettings(settingID);
      if (result.data && result.data.length > 0) {
        setObjSetting({
          aliExpress: {
            appID: result.data[0].aliExpress.appID,
            secretKey: result.data[0].aliExpress.secretKey,
          },
          sallaAccount: {
            clientID: result.data[0].sallaAccount.clientID,
            clientSecretKey: result.data[0].sallaAccount.clientSecretKey,
          },
        });
      }
      if (result.isError) throw new Error(result.message);
    } catch (ex: any) {
      Utils.showErrorMessage(ex.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && Utils.isUserLoggedIn()) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const url = new URL(window.location.href);
  const token = url.searchParams.get("code");

  useEffect(() => {
    const loadData = async (token: string) => {
      try {
        setPageLoading(true)
        const result = await ApiServices.getSallaAccountToken(token)
        Utils.setItem(enums.SALLA_TOKEN, result)
        window.location.replace("/dashboard")
      } catch (ex: any) {
        Utils.showErrorMessage(ex.message)
      } finally {
        setPageLoading(false)
      }
    }

    if (!Utils.getItem(enums.SALLA_TOKEN) && token) {
      loadData(token)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])


  if (pageLoading) return <PageLoading />
  return (
    <AuthGuard>
      <MenuAppBar>
        <Box
          sx={{
            bgcolor: "background.paper",
            width: !isLarge ? "100%" : "60%",
            margin: "auto",
          }}
        >
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
                label="Ali Express Account"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
                label="Salla Account"
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          {isLoading ? (
            <LinearProgress sx={{ mt: 2 }} />
          ) : (
            <form onSubmit={onHandleSubmit as any}>
              <>
                <CustomTabPanel value={value} index={0} dir={theme.direction}>
                  <Stack gap={2} direction={"row"}>
                    <TextField
                      onChange={(e: any) => {
                        configureSettingObjects({
                          aliExpress: {
                            ...objSetting.aliExpress,
                            appID: e.target.value,
                          },
                          ...objSetting.sallaAccount,
                        });
                      }}
                      required
                      value={objSetting.aliExpress.appID || ""}
                      fullWidth
                      id="outlined-basic"
                      label="App Id"
                      placeholder="Please Enter App Id"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e: any) => {
                        configureSettingObjects({
                          aliExpress: {
                            ...objSetting.aliExpress,
                            secretKey: e.target.value,
                          },
                          ...objSetting.sallaAccount,
                        });
                      }}
                      required
                      value={objSetting.aliExpress.secretKey || ""}
                      fullWidth
                      id="outlined-basic"
                      label="Secret Key"
                      placeholder="Please Enter Secret Key"
                      variant="outlined"
                    />
                  </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} dir={theme.direction}>
                  <Stack gap={2} direction={"row"}>
                    <TextField
                      onChange={(e: any) => {
                        configureSettingObjects({
                          sallaAccount: {
                            ...objSetting.sallaAccount,
                            clientID: e.target.value,
                          },
                          ...objSetting.aliExpress,
                        });
                      }}
                      required
                      value={objSetting.sallaAccount.clientID || ""}
                      fullWidth
                      id="outlined-basic"
                      label="Client Id"
                      placeholder="Please Enter Client Id"
                      variant="outlined"
                    />
                    <TextField
                      onChange={(e: any) => {
                        configureSettingObjects({
                          sallaAccount: {
                            ...objSetting.sallaAccount,
                            clientSecretKey: e.target.value,
                          },
                          ...objSetting.aliExpress,
                        });
                      }}
                      required
                      value={objSetting.sallaAccount.clientSecretKey || ""}
                      fullWidth
                      id="outlined-basic"
                      label="Client Secret Key"
                      placeholder="Please Enter Client Secret Key"
                      variant="outlined"
                    />
                  </Stack>
                </CustomTabPanel>
                <Box sx={{ pt: 4 }}>
                  <Button type="submit" disabled={isLoading} variant="outlined">
                    Save Information
                  </Button>
                </Box>
              </>
            </form>
          )}
        </Box>
      </MenuAppBar>
    </AuthGuard>
  );
};

export default SettingsPage;
