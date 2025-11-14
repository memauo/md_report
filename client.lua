local lastActionTime = 0
local cooldown = Config.Cooldown
local allowed = 0
RegisterCommand(Config.ReportCommand, function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openMenu",
    })
end)
RegisterNUICallback('closeMenu', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
    
end)


RegisterNUICallback('sendReport', function(data, cb)
    local currentTime = GetGameTimer()
    if currentTime - lastActionTime >= cooldown then
    local head = data.head
    local info = data.info
    local type = data.type
    local h = data.h
    local m = data.m
    TriggerServerEvent("md_report:sendReport", head, info, type, h, m)
        lib.notify({
        title = 'MD REPORT',
        description = 'Report Created.',
        type = 'success',
        position = 'top-right',
        duration = 5000,
        icon = 'check',
        iconColor = '#66ff00ff'
    })
        lastActionTime = currentTime
    else
        local remaining = math.ceil((cooldown - (currentTime - lastActionTime)) / 1000)
    end
    cb('ok')
end)

RegisterNetEvent("reportadmin", function(head, info, type,h,m, id)
        SendNUIMessage({
            action = "addReport",
            head = head,
            id = id,
            info = info,
            type = type,
            h = h,
            m = m,
        })
    if allowed==1 then
        lib.notify({
        title = 'MD REPORT',
        description = 'New Report Created.',
        type = 'inform',
        position = 'top-right',
        duration = 5000,
        iconColor = '#556df5ff'
        })
    end
end)

RegisterCommand(Config.AdminCommand, function()
    TriggerServerEvent("md_report:getAdminGroup")
end)

RegisterNetEvent("md_report:reportForAdmin", function(group)
    for i = 1, #Config.AllowedGroups do
        if Config.AllowedGroups[i] == group then
            allowed = 1
        end
    end
    if allowed==1 then
        SetNuiFocus(true, true)
    end
    SendNUIMessage({
        action = "openAdminMenu",
        allowed = allowed
    })

end)

RegisterNUICallback("actions", function(data, cb)
    if data.act == 0 then
        local plId = data.plId
        TriggerServerEvent("teleport", plId)
    end
    if data.act == 1 then
        local plId = data.plId
        TriggerServerEvent("md_report:respondingAlert", plId)
    end
    if data.act == 2 then
        TriggerServerEvent("close",data.targetId)
    end
    cb('ok')
end)

RegisterNUICallback("sendMsgss", function(data, cb)
    local msgg = data.msgg
    local idmsg = data.idmsg
    TriggerServerEvent("md_report:sendMsg", msgg, idmsg)
    cb('ok')
end)

RegisterNetEvent("tp", function(coordss)
    local playerPewd = PlayerPedId()
    SetEntityCoords(playerPewd, coordss.x, coordss.y, coordss.z)
end)

RegisterNetEvent("getMsg", function(msgg, idmsg, playerName)
    SendNUIMessage({
        action = "getMsg",
        msg = msgg,
        MsgId = idmsg,
        playerName = playerName
    })
end)

RegisterNUICallback("getMyId", function(data, cb)
    local playerId = PlayerId()
    local serverId = GetPlayerServerId(playerId)
    SendNUIMessage({
        action = "setMyId",
        serverId = serverId,
    })
    cb('ok')
end)

RegisterNetEvent("md_report:close", function(targetId)
    SendNUIMessage({
        action = "closeticket",
        targetId = targetId
    })
end)

RegisterNUICallback("respondingAlert", function(data, cb)
    local plid = data.repid 
    TriggerServerEvent("md_report:respondingAlert", plid)
    cb('ok')
end)

RegisterNetEvent("md_report:adminrespondingAlert", function()
    lib.notify({
        title = 'MD REPORT',
        description = 'Admin is solving ticket.',
        type = 'inform',
        position = 'top-right',
        duration = 5000,
    })
end)

RegisterNetEvent("md_report:solvingrep", function(plid)
    SendNUIMessage({
        action = "setsolving",
        plid = plid
    })
end)
RegisterNUICallback("markasdoneAlert", function(data, cb)
    local plid = data.repid 
    TriggerServerEvent("md_report:doneAlert", plid)
    cb('ok')
end)


RegisterNetEvent("md_report:admindoneAlert", function()
    SendNUIMessage({
        close = "close",
    })
    lib.notify({
        title = 'MD REPORT',
        description = 'Report marked as done',
        type = 'success',
        position = 'top-right',
        duration = 5000,
    })
end)

RegisterNUICallback("playerNotify", function(data, cb)
    lib.notify({
        title = 'MD REPORT',
        description = 'New message in your report: ' .. data.msg,
        type = 'inform',
        position = 'top-right',
        duration = 5000,
        icon = 'envelope',
    })
    cb('ok')
end)