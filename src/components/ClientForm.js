import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import { urlApi } from "../utils/config"

const ClientForm = () => {
  const [client, setClient] = useState({
    name: "",
    surname: "",
    date_birth: new Date()
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      loadClient(params.id);
    } else {
      setClient({
        name: "",
        surname: "",
        date_birth: new Date()
      });
      setEditing(false)
    }
  }, [params.id]);

  const loadClient = async (id) => {
    const res = await fetch(urlApi + "client/get/" + id);
    const data = await res.json();
    setClient({ name: data.name, surname: data.surname, date_birth: data.date_birth });
    setEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      
      if (editing) {
        const response = await fetch(urlApi + "client/update/" + params.id,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(client),
          }
        );
        await response.json();
      } else {
        const url = urlApi + "client/add";
        console.log(client)
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(client),
        });
        await response.json();
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) =>
    setClient({ ...client, [e.target.name]: e.target.value });

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
      justifyContent="center"
    >
      <Grid item xs={3}>
        <Card
          sx={{ mt: 5 }}
          style={{
            backgroundColor: "#1E272E",
            padding: "1rem",
          }}
        >
          <Typography variant="h5" textAlign="center" color="white">
            {editing ? "Actualizar cliente" : "Crear cliente"}
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                label="Nombres"
                sx={{
                  display: "block",
                  margin: ".5rem 0",
                }}
                name="name"
                onChange={handleChange}
                value={client.name}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#BCBCBC" } }}
              />
              <TextField
                variant="outlined"
                label="Apellidos"
                sx={{
                  display: "block",
                  margin: ".5rem 0",
                }}
                name="surname"
                onChange={handleChange}
                value={client.surname}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#BCBCBC" } }}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  InputProps={{ style: { color: "white", width: 195 } }}
                  value={client.date_birth}
                  onChange={(e) => {
                    setClient({...client, date_birth: e });
                  }}
                  name="date_birth"
                  renderInput={(params) => <TextField {...params}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#BCBCBC" } }} sx={{
                      display: "block",
                    }} />}
                />
              </LocalizationProvider>

              <Grid container direction="row">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  marginTop: 15
                }}
                disabled={!client.name || !client.surname}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : editing ? "Actualizar" : "Crear"
                }
              </Button>
              </Grid>
              
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClientForm;
