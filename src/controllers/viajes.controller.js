const ClienteModel = require('../models/viajes.model');

const getAllViajes = async (req, res) => {
  const viajes = await ClienteModel.selectViajes();
  console.log(viajes);
};
const getViajeById = async (req, res) => {};
const getViajesFromUser = async (req, res) => {};
const createViaje = async (req, res) => {};
const updateViaje = async (req, res) => {};
const deleteViaje = async (req, res) => {};

module.exports = { getAllViajes, getViajeById, getViajesFromUser, createViaje, updateViaje, deleteViaje };
