import AddBox from "@mui/icons-material/AddBox";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import MaterialTable, { Action, Column, MaterialTableProps } from "material-table";
import Box from "@mui/material/Box"
import { forwardRef } from "react";

const tableIcons: any = {
  Add: forwardRef((props: any, ref: any) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props: any, ref: any) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props: any, ref: any) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props: any, ref: any) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props: any, ref: any) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props: any, ref: any) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props: any, ref: any) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props: any, ref: any) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props: any, ref: any) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props: any, ref: any) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props: any, ref: any) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props: any, ref: any) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props: any, ref: any) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props: any, ref: any) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props: any, ref: any) => <ViewColumn {...props} ref={ref} />)
};

interface IExtendedAction<T extends object> extends Action<T> {
  showOnMultiSelect?: boolean;
  hideOnSingleSelect?: boolean;
  render?: (rowData: T) => any;
}

export interface IExtendedColumn<T extends object> extends Column<T> {
  renderReturnsString?: boolean;
  style?: (rowData: T) => void | React.CSSProperties;
}


export interface IDataTable<T extends object> extends MaterialTableProps<any> {
  columns: IExtendedColumn<T>[];
  actions?: IExtendedAction<T>[];
  menuActions?: IExtendedAction<T>[];

  onEdit?: (rowData: T) => void;
  onDelete?: (rowData: T) => void;
  onDeleteBatch?: (rowData: T[]) => void;
  onView?: (rowData: T) => void;
  onAdd?: (rowData: T) => void;
  onShare?: (rowData: T) => void;
  onReload?: (rowData: T) => void;
  getRowStyle?: (rowData: T) => void;
  onRowSelect?: (rowData: T) => void;

  fixed?: boolean;
  selection?: any;
  allowMultiEdit?: boolean;
  allowMultiDelete?: boolean;
  error?: any;

  customTitle?: any;
  disableMenuAction?: (row: T) => boolean;
}

const DataTable = (props: IDataTable<any>) => {
  let actions: IExtendedAction<any>[] = [];

  const getTitle = () => {
    if (!props.title) return "N/A";

    return props.title
  };

  const getData = () => {
    if (!props.data) return [];
    return props.data;
  };

  if (props.onEdit) {
    actions.push({
      icon: "edit",
      tooltip: "Edit",
      position: "row",
      onClick: (event: any, rowData: any) =>
        props.onEdit ? props.onEdit(rowData) : undefined,
    });
  }
  if (props.onView) {
    actions.push({
      icon: "visibility",
      tooltip: "View",
      position: "row",
      onClick: (event: any, rowData: any) =>
        props.onView ? props.onView(rowData) : undefined,
    });
  }
  if (props.allowMultiEdit)
    actions.push({
      icon: "edit",
      tooltip: "Edit",
      position: "toolbarOnSelect",
      onClick: (event: any, rowData: any) =>
        props.onEdit ? props.onEdit(rowData) : undefined,
    });

  if (props.onDelete)
    actions.push({
      icon: tableIcons.Delete,
      tooltip: "Delete",
      position: "row",
      onClick: (event: any, rowData: any) =>
        props.onDelete ? props.onDelete(rowData) : undefined,
    });

  if (props.allowMultiDelete)
    actions.push({
      icon: tableIcons.Delete,
      tooltip: "Delete Selected",
      position: "toolbarOnSelect",
      onClick: (event: any, rowData: any) =>
        props.onDeleteBatch ? props.onDeleteBatch(rowData) : undefined,
    });

  if (props.onReload)
    actions.push({
      isFreeAction: true,
      icon: tableIcons.ReplayIcon,
      tooltip: "Reload Data",
      onClick: (event: any, rowData: any) =>
        props.onReload ? props.onReload(rowData) : undefined,
    });
  if (props.onAdd)
    actions.push({
      icon: tableIcons.Add,
      tooltip: "Add",
      isFreeAction: true,
      onClick: (event: any, rowData: any) =>
        props.onAdd ? props.onAdd(rowData) : undefined,
    });

  return (
    <>
      <Box style={{ maxWidth: '100%' }}>
        <MaterialTable
          icons={tableIcons}
          isLoading={props.isLoading}
          columns={props.columns}
          data={getData() || []}
          title={getTitle() || "N/A"}
          options={{
            ...props.options,
            headerStyle: {
              fontWeight: "bold"
            },
          }}
        />
      </Box>
    </>
  )
}

export default DataTable
