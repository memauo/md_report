ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

RegisterNetEvent("md_report:sendReport",function(head, info, type, h, m)
    local id = source
    TriggerClientEvent("reportadmin", -1, head,info, type, h,m, id)
end)


RegisterNetEvent("md_report:getAdminGroup", function()
    local xPlayer = ESX.GetPlayerFromId(source)
    local group = xPlayer.getGroup()
    TriggerClientEvent("md_report:reportForAdmin", source, group)
end)

RegisterNetEvent("teleport", function(plId)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    local xTarget = ESX.GetPlayerFromId(plId)
    local targetPed = GetPlayerPed(plId)
    local coordss = GetEntityCoords(targetPed)
    TriggerClientEvent("tp", source, coordss)
end)


RegisterNetEvent("md_report:sendMsg", function(msgg, idmsg)
    local playerId = source
    local playerName = GetPlayerName(playerId) 
    TriggerClientEvent("getMsg", -1, msgg, idmsg, playerName)
end)
RegisterNetEvent("close", function(targetId)
    TriggerClientEvent("md_report:close", -1, targetId)
end)
RegisterNetEvent("md_report:respondingAlert", function(plid)
    TriggerClientEvent("md_report:adminrespondingAlert", plid)
    TriggerClientEvent("md_report:solvingrep", -1, plid)
end)

RegisterNetEvent("md_report:doneAlert", function(plid)
    TriggerClientEvent("md_report:admindoneAlert", plid)
end)